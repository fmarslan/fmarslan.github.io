# Ruby + dev tools içeren hazır devcontainer imajı
FROM mcr.microsoft.com/devcontainers/ruby:3.2

# Çalışma klasörü (projenin kendisi)
WORKDIR /workspaces/personel-website

# Bundler / Jekyll / Ruby LSP kur
# GEM_HOME ve BUNDLE_PATH bu proje klasörünün altına alınacak
ENV GEM_HOME=/workspaces/personel-website/vendor/bundle
ENV BUNDLE_PATH=/workspaces/personel-website/vendor/bundle
# Gem binary'lerini PATH'e ekle (ruby-lsp burada olacak)
ENV PATH="$GEM_HOME/bin:$PATH"

# Gerekli gem'ler: bundler, jekyll, ruby-lsp
RUN gem install bundler jekyll ruby-lsp

# İstersen ileride bundle config ile de aynı path'i garanti altına alabilirsin:
# RUN bundle config set --local path 'vendor/bundle'
