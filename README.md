## Making NFT from texture

This is a simple example of making NFT from texture, and upload it on IPFS.

### clone this repo

```
git clone git@github.com:b3hr4d/node-nft-maker.git
```

### cd to the repo

```
cd node-nft-maker
```

### copy .env.example to .env and fill it

```
cp .env.example .env
```

### install dependencies

```
npm install
```

or

```
yarn
```

### run

```
npm run start
```

or

```
yarn start
```

### run in background

```
npm run start:background
```

or

```
yarn start:background
```

### stop

```
ps -ef | grep node

kill -9 PID
```

### check log

```
tail -f nohup.out
```
