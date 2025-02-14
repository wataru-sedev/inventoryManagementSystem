// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  writeBatch,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebaseの設定オブジェクト
const firebaseConfig = {
  apiKey: "AIzaSyCEBcpn1WV35bnVf8-5z5jvXQu1Y47G3ho",
  authDomain: "inventorymanagement-f7db4.firebaseapp.com",
  projectId: "inventorymanagement-f7db4",
  storageBucket: "inventorymanagement-f7db4.firebasestorage.app",
  messagingSenderId: "858516922988",
  appId: "1:858516922988:web:6a143e7608ca225700ee49",
  measurementId: "G-046FERBD46",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const drinks = [
  { name: "KARUOSU", japaneseName: "かるおす", quantity: 0 },
  { name: "MATTARI", japaneseName: "まったり", quantity: 0 },
  { name: "MATCHA", japaneseName: "抹茶ビール", quantity: 0 },
  {
    name: "ASAHI_SUPER_DRY",
    japaneseName: "アサヒスーパードライ",
    quantity: 0,
  },
  { name: "YUZU_CHUHAI", japaneseName: "柚子チューハイ", quantity: 0 },
  { name: "UME_CHUHAI", japaneseName: "梅チューハイ", quantity: 0 },
  { name: "GYOKURO_UMESHU", japaneseName: "玉露梅酒", quantity: 0 },
  { name: "HANNARI_UMESHU", japaneseName: "京はんなり梅酒", quantity: 0 },
  { name: "JUNMAISHU", japaneseName: "京の地酒 純米酒", quantity: 0 },
  { name: "YUZU_CIDER", japaneseName: "ゆずサイダー", quantity: 0 },
  { name: "COLA", japaneseName: "コーラ", quantity: 0 },
  { name: "ALL_FREE", japaneseName: "オールフリー", quantity: 0 },
  { name: "JURAKUDAI", japaneseName: "聚楽第", quantity: 0 },
  { name: "KINSHIMASAMUNE", japaneseName: "金鵄政宗", quantity: 0 },
  { name: "TAMAGAWA", japaneseName: "玉川", quantity: 0 },
  { name: "GESSHOU", japaneseName: "げっしょう", quantity: 0 },
  { name: "ORANGE", japaneseName: "オレンジジュース", quantity: 0 },
];

async function initializeInventory() {
  const inventoryRef = collection(db, "inventory");

  for (const drink of drinks) {
    const docRef = doc(inventoryRef, drink.name); // ドキュメント ID にドリンク名を設定

    try {
      await setDoc(docRef, { quantity: drink.quantity }); // フィールドとして quantity を登録
      console.log(`${drink.name} の在庫を Firestore に登録しました`);
    } catch (error) {
      console.error(`エラー: ${drink.name} の登録に失敗`, error);
    }
  }

  alert("在庫データを Firestore に登録しました！");
  loadInventory(); // Firestore のデータを取得して UI を更新
}

let inventory = drinks;

function renderTable() {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";
  inventory.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${item.japaneseName}</td>
            <td><input type="number" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)"></td>
        `;
    table.appendChild(row);
  });
}
function updateQuantity(index, quantity) {
  if (isNaN(quantity) || quantity < 0) {
    alert("在庫数は0以上の数値を入力してください。");
    return;
  }
  inventory[index].quantity = parseInt(quantity, 10);
}

async function updateInventory() {
  try {
    const batch = writeBatch(db);
    inventory.forEach((item) => {
      const docRef = doc(db, "inventory", item.name);
      batch.update(docRef, { quantity: item.quantity });
    });
    await batch.commit();
    alert("在庫データを更新しました");
    loadInventory();
  } catch (error) {
    console.error("更新エラー:", error);
  }
}

async function loadInventory() {
  try {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    inventory = drinks.map((drink) => {
      const docData = querySnapshot.docs.find((doc) => doc.id === drink.name);
      return {
        id: drink.name,
        name: drink.name,
        japaneseName: drink.japaneseName,
        quantity: docData ? docData.data().quantity : 0, //firestoreにデータがなければ0にする
      };
    });
    renderTable();
  } catch (error) {
    console.error("読み込みエラー: ", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadInventory();
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("updateInventory")
    .addEventListener("click", updateInventory);
  loadInventory();
});

window.updateQuantity = updateQuantity;
window.initializeInventory = initializeInventory;
window.loadInventory = loadInventory;
