test:
	yarn test

deploy:
	rm -f build.zip
	zip -r build.zip node_modules index.js
	aws --profile utkast lambda update-function-code --function-name ruppertdesign-ratings --zip-file fileb://./build.zip
	