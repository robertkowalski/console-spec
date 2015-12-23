api:
	curl https://api.csswg.org/bikeshed/ -F md-Text-Macro="SNAPSHOT-LINK dummy" -F file=@index.bs > index.html
	npm run ecmarkupify index.html index.html
