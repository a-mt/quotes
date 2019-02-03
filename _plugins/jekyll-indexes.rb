require 'pp'

module Jekyll
  class IndexesGenerator < Generator
    safe true

    # Entrypoint
    # Params:
    # +site+::       Site wide information + configuration settings
    def generate(site)
      site.collections.each_key do |collection|
        dir = "_#{collection}"

        if File.directory?(dir)
          generate_index(dir, collection, site)
        end
      end
    end

    # Loop all directories and subdirectories in dir
    # and generate a page "index.html" in it (if it doesn't exist already)
    # Params:
    # +dir+::        Current directory path
    # +collection+:: Name of the collection
    # +site+::       The site object
    def generate_index(dir, collection, site)
      Dir.foreach(dir) do |item|
        next if item =='.' || item == '..'

        subdir = File.join(dir,item)
        if File.directory? subdir
          path = File.join(subdir, 'index.html')

          # Index file doesn't exist: create it
          unless File.file? path
            create_index(path, item, collection)

            # Create the page (only usefull for the current serve)
            doc = Document.new(path, :site => site, :collection => site.collections[collection])
            doc.read
            site.collections[collection].docs << doc
          end
          generate_index(subdir, collection, site)
        end
      end
    end

    # Create a new index.html file
    # Params:
    # +path+:: Path of the file to create
    # +title+:: Title of the page
    # +collection+:: Name of the collection
    def create_index(path, title, collection)
      txt = <<TXT
---
title: "#{title}"
index: true
---

{% include dir_quotes.html collection="#{collection}" %}
TXT
      File.open(path, "w") {|f| f.write(txt) }
    end
  end
end
