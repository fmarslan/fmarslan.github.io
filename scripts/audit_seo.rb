require 'nokogiri'
require 'json'
require 'uri'

root = File.expand_path(ARGV[0] || '_site')
errors = []
pages = {}
Dir.glob("#{root}/**/*.html").each do |file|
  doc = Nokogiri::HTML(File.read(file))
  next if doc.at_css('meta[http-equiv="refresh"]')
  next unless doc.at_css('meta[name="generator"][content="Jekyll"]')
  path = file.delete_prefix(root)
  pages[path] = doc
  errors << [path, 'missing language'] if doc.at_css('html')['lang'].to_s.empty?
  errors << [path, 'missing title'] if doc.at_css('title')&.text.to_s.strip.empty?
  errors << [path, 'canonical count'] unless doc.css('link[rel="canonical"]').size == 1
  errors << [path, 'expected one main heading'] unless doc.css('h1').size == 1
  errors << [path, 'automatic language redirect'] if doc.css('script[src]').any? { |n| n['src'].include?('language-redirect') }
  doc.css('img').each do |img|
    errors << [path, "missing image dimensions #{img['src']}"] unless img['width'].to_i > 0 && img['height'].to_i > 0
    errors << [path, "HTTP image #{img['src']}"] if img['src'].to_s.start_with?('http:')
  end
  %w[description robots twitter:card twitter:title twitter:description twitter:image twitter:image:alt].each do |name|
    errors << [path, "missing #{name}"] if doc.at_css("meta[name='#{name}']")&.[]('content').to_s.strip.empty?
  end
  %w[og:title og:description og:image og:image:alt og:url og:type].each do |name|
    errors << [path, "missing #{name}"] if doc.at_css("meta[property='#{name}']")&.[]('content').to_s.strip.empty?
  end
  errors << [path, 'missing JSON-LD'] if doc.css('script[type="application/ld+json"]').empty?
  doc.css('script[type="application/ld+json"]').each do |script|
    begin
      data = JSON.parse(script.text)
      graph = data.fetch('@graph', [])
      errors << [path, 'missing page schema'] unless graph.any? { |node| %w[WebPage Article ProfilePage].include?(node['@type']) }
    rescue JSON::ParserError => e
      errors << [path, "invalid JSON-LD: #{e.message[0, 80]}"]
    end
  end
  doc.css('meta[property="og:image"], link[rel="icon"], link[rel="alternate icon"]').each do |node|
    url = node['content'] || node['href']
    uri = URI.parse(URI::DEFAULT_PARSER.escape(url, /[^\x21-\x7e]/))
    next if uri.host && uri.host != 'fmarslan.com'
    asset = File.join(root, URI::DEFAULT_PARSER.unescape(uri.path))
    errors << [path, "missing asset #{url}"] unless File.file?(asset)
  end
end
map = Nokogiri::XML(File.read("#{root}/sitemap.xml"))
urls = map.xpath('//*[local-name()="loc"]').map(&:text)
errors << ['sitemap', 'duplicate URLs'] unless urls.uniq == urls
urls.each do |url|
  uri = URI.parse(url)
  errors << [url, 'non-production URL'] unless uri.scheme == 'https' && uri.host == 'fmarslan.com'
  path = URI::DEFAULT_PARSER.unescape(uri.path)
  path += 'index.html' if path.end_with?('/')
  errors << [url, 'missing output'] unless File.file?(File.join(root, path))
  doc = pages[path]
  next unless doc
  errors << [url, 'canonical mismatch'] unless doc.at_css('link[rel="canonical"]')&.[]('href') == url
  errors << [url, 'noindex in sitemap'] if doc.at_css('meta[name="robots"]')&.[]('content').to_s.include?('noindex')
  doc.css('link[hreflang]').each do |link|
    target = URI::DEFAULT_PARSER.unescape(URI.parse(link['href']).path)
    target += 'index.html' if target.end_with?('/')
    target_doc = pages[target]
    errors << [url, "missing alternate #{target}"] unless target_doc
    next if link['hreflang'] == 'x-default' || !target_doc
    errors << [url, "nonreciprocal alternate #{target}"] unless target_doc.css('link[hreflang]').any? { |n| n['href'] == url }
    errors << [url, "alternate language mismatch #{target}"] unless target_doc.at_css('html')['lang'] == link['hreflang']
  end
  x_default = doc.at_css('link[hreflang="x-default"]')
  english = doc.at_css('link[hreflang="en"]')
  errors << [url, 'x-default must match English'] if english && x_default&.[]('href') != english['href']
end
pages.each do |path, doc|
  doc.css('a[href],img[src],script[src],link[rel="stylesheet"]').each do |node|
    value = node['href'] || node['src']
    next if value.to_s.empty? || value.start_with?('#', 'mailto:', 'tel:', 'data:')
    begin
      base = 'https://fmarslan.com' + URI::DEFAULT_PARSER.escape(path)
      uri = URI.join(base, URI::DEFAULT_PARSER.escape(value, /[^\x21-\x7e]/))
      next unless uri.host == 'fmarslan.com'
      target = File.join(root, URI::DEFAULT_PARSER.unescape(uri.path))
      target = File.join(target, 'index.html') if File.directory?(target)
      errors << [path, "broken internal resource #{value}"] unless File.file?(target)
    rescue URI::InvalidURIError
      errors << [path, "invalid internal URL #{value}"]
    end
  end
end
errors << ['/', 'default home must be English'] unless pages['/index.html']&.at_css('html')&.[]('lang') == 'en'
errors << ['/tr/', 'Turkish home missing'] unless pages['/tr/index.html']&.at_css('html')&.[]('lang') == 'tr'
['/about/index.html', '/en/about/index.html'].each do |path|
  graph = JSON.parse(pages.fetch(path).at_css('script[type="application/ld+json"]').text).fetch('@graph')
  person = graph.find { |item| item['@type'] == 'Person' }
  profile = graph.find { |item| item['@type'] == 'ProfilePage' }
  errors << [path, 'profile identity missing'] unless person&.fetch('name') == 'Fatih Mehmet Arslan' && person['alternateName'] == 'fmarslan'
  errors << [path, 'profile must reference author'] unless profile&.dig('mainEntity', '@id') == person&.fetch('@id')
end
pages.each do |path, doc|
  next unless doc.at_css('.post-byline')
  expected_profile = doc.at_css('html')['lang'] == 'en' ? '/en/about/' : '/about/'
  errors << [path, 'author profile link missing'] unless doc.at_css('.post-byline a[rel="author"]')&.[]('href') == expected_profile
end
Dir.glob("#{root}/**/*.html").each do |file|
  doc = Nokogiri::HTML(File.read(file))
  refresh = doc.at_css('meta[http-equiv="refresh"]')
  next unless refresh
  target = refresh['content'].to_s.split(/url=/i, 2).last.to_s.strip
  begin
    uri = URI.parse(target)
    raise URI::InvalidURIError unless uri.scheme == 'https' && uri.host == 'fmarslan.com'
    target_path = uri.path.end_with?('/') ? uri.path + 'index.html' : uri.path
    target_doc = pages[target_path]
    errors << [file.delete_prefix(root), "redirect target missing or chained #{target}"] unless target_doc
    errors << [file.delete_prefix(root), 'redirect canonical mismatch'] unless doc.at_css('link[rel="canonical"]')&.[]('href') == target
  rescue URI::InvalidURIError
    errors << [file.delete_prefix(root), "invalid redirect #{target}"]
  end
end
puts JSON.pretty_generate({pages: pages.size, sitemap_urls: urls.size, errors: errors})
exit(errors.empty? ? 0 : 1)
