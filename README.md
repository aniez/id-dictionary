# id-dictionary
Just hobby project in node.js, using express.js and so

run server
```
./bin/www
```
OR
```
nodemon bin/www
```

run tests with globally installed mocha
```
mocha app/**/*UnitTest.js
```

run acceptance tests, while server is running
```
mocha app/**/*AcceptanceTest.js
```

run ALL tests, while server is running
```
mocha app/**/*Test.js
```

Generate documentation:
```
docco app/api/id-dictionary/*.js
```


Documentation should be in .gitignore, but for now it's part of repo
