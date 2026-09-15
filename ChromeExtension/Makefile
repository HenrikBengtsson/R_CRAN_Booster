spelling:
	Rscript -e "spelling::spell_check_files('NEWS.md', ignore=readLines('WORDLIST'))"

build: spelling
	npx --yes web-ext build --overwrite-dest

lint: build
	npx --yes addons-linter web-ext-artifacts/*.zip

Rlogo.svg:
	wget https://www.r-project.org/logo/Rlogo.svg

Rlogo_724x724.png: Rlogo.svg
	convert "$<" -background white -gravity center -extent 724x724 "$@"
	identify "$@" 

Rlogo_128x128.png: Rlogo_724x724.png
	convert "$<" -resize 128x128 "$@"
	identify "$@" 

Rlogo_48x48.png: Rlogo_724x724.png
	convert "$<" -resize 48x48 "$@"
	identify "$@" 

Rlogo_16x16.png: Rlogo_724x724.png
	convert "$<" -resize 16x16 "$@"
	identify "$@" 

r-logos: Rlogo_16x16.png Rlogo_48x48.png Rlogo_128x128.png
