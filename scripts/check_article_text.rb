require 'jekyll'
require 'nokogiri'

# Compare generated article wording/code to Jekyll's original Markdown conversion,
# before layouts alter heading levels, image attributes or link destinations.
Jekyll::PluginManager.require_from_bundler
site = Jekyll::Site.new(Jekyll.configuration)
site.process
errors = []
site.posts.docs.each do |post|
  original = Nokogiri::HTML.fragment(post.content)
  body = Nokogiri::HTML(post.output).at_css('.post-body')
  if !body || original.text.gsub(/\s+/, ' ').strip != body.text.gsub(/\s+/, ' ').strip
    errors << "Article wording changed: #{post.url}"
  end
  if body && original.css('pre').map(&:text) != body.css('pre').map(&:text)
    errors << "Code block changed: #{post.url}"
  end
end
abort errors.join("\n") unless errors.empty?
puts "Verified unchanged wording and code in #{site.posts.docs.size} articles."
