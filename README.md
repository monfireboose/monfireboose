# Monfireboose

> A lightweight JavaScript library that provides a high level and model based API for interacting with **Firebase**.

Use your [**Firebase**](https://firebase.google.com/) like [**Mongoose**](https://mongoosejs.com/). <br>
Ever thought about using your **Firestore collections** like **Mongoose models**, Monfireboose will help with this.

## 👀 What can it do?

It allows you to manage your whole _Firestore database with models built by you_.

## 🔍 Table of Contents

- [⚙️ Install](#️-install)
- [💡 Usage](#-usage)
- [💬 Discussions](#-discussions)
- [📄 License](#-license)

## ⚙️ Install

Install it locally in your project folder:

```bash
# Using npm
npm i monfireboose
# Or yarn
yarn add monfireboose
# Or pnpm
pnpm add monfireboose
```

## 💡 Usage

- Connect to the **Firestore database** like to **MongodDB** with **Mongoose**
- Create and validate Schemas like with **Mongoose**

```js
import { connect, FirebaseConfig, Schema, model } from 'monfireboose';

const config = new FirebaseConfig({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

connect(config).then((app) => {
  console.log('Connected to Firebase', app);
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const userModel = model('users', userSchema);

const user = await userModel.add({ name: 'John', age: 30 });

console.log(user.id);
```

### All CRUD available methods

- add - adds a new document
- edit - edits existing document
- get - get documents with given query (or all documents if query is not given)
- getDoc - gets one document by ID
- delete - delets document by ID

_\*Note: Missing something? don't worry **Monfireboose** includes all **Firebase** native modules under_ `monfireboose/fire/needed_module`. `needed_module` _is you desired module e.g._ `auth`, `firestore`, `storage` _etc._

## 💬 Discussions

Head over to the [discussions](https://github.com/monfireboose/monfireboose/discussions) to share your ideas.

## 📄 License

MIT © [Monfireboose](https://github.com/monfireboose) © [Albert Arakelyan](https://github.com/AlbertArakelyan)
