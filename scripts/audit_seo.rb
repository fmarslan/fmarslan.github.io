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
      errors << [path, 'missing WebPage/Article schema'] unless graph.any? { |node| %w[WebPage Article].include?(node['@type']) }
    rescue JSON::ParserError => e
      errors << [path, "invalid JSON-LD: #{e.message[0, 80]}"]
    end
  end
  doc.css('meta[property="og:image"], link[rel="icon"], link[rel="alternate icon"]').each do |node|
    url = node['content'] || node['href']
    uri = URI.parse(url)
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
  end
end
puts JSON.pretty_generate({pages: pages.size, sitemap_urls: urls.size, errors: errors})
exit(errors.empty? ? 0 : 1)
