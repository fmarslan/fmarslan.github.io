# Ruby + dev tools içeren hazır devcontainer imajı
FROM mcr.microsoft.com/devcontainers/ruby:3.2

# Jekyll için gerekli gem'ler (bundler genelde var ama garanti olsun)
RUN gem install bundler jekyll
# RUN bundle config set --local path '/workspaces/personel-website/vendor/bundle'

ENV BUNDLE_PATH=/workspaces/personel-website/vendor/bundle
ENV GEM_HOME=/workspaces/personel-website/vendor/bundle

# Çalışma klasörü
WORKDIR /workspaces

# Locale / tz vs. istersen buraya ek ayar koyabilirsin
