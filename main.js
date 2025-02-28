import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
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
  {
    name: "KARUOSU",
    japaneseName: "かるおす(10)",
    quantity: null,
    requiredQuantity: 20,
  },
  {
    name: "MATTARI",
    japaneseName: "まったり(10)",
    quantity: null,
    requiredQuantity: 20,
  },
  {
    name: "MATCHA",
    japaneseName: "抹茶ビール(5)",
    quantity: null,
    requiredQuantity: 20,
  },
  {
    name: "JUNMAISHU",
    japaneseName: "京の地酒 純米酒(5)",
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "ASAHI_SUPER_DRY",
    japaneseName: "アサヒスーパードライ(10)",
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "YUZU_CHUHAI",
    japaneseName: "柚子チューハイ(5)",
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "UME_CHUHAI",
    japaneseName: "梅チューハイ(5)",
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "GYOKURO_UMESHU",
    japaneseName: "玉露梅酒(5)",
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "HANNARI_UMESHU",
    japaneseName: "京はんなり梅酒(5)",
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "YUZU_CIDER",
    japaneseName: "ゆずサイダー(10)",
    quantity: null,
    requiredQuantity: 15,
  },
  {
    name: "COLA",
    japaneseName: "コーラ(10)",
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "ALL_FREE",
    japaneseName: "オールフリー(8)",
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "JURAKUDAI",
    japaneseName: "聚楽第(1)",
    quantity: null,
    requiredQuantity: 1,
  },
  {
    name: "KINSHIMASAMUNE",
    japaneseName: "金鵄政宗(1)",
    quantity: null,
    requiredQuantity: 1,
  },
  {
    name: "TAMAGAWA",
    japaneseName: "玉川(1)",
    quantity: null,
    requiredQuantity: 1,
  },
  {
    name: "GESSHOU",
    japaneseName: "げっしょう(1)",
    quantity: null,
    requiredQuantity: 1,
  },
  {
    name: "ORANGE",
    japaneseName: "オレンジジュース(2/3)",
    quantity: null,
    requiredQuantity: 2,
  },
];

let inventory = drinks;

async function initializeInventory() {
  const inventoryRef = collection(db, "inventory");

  for (const item of drinks) {
    const docRef = doc(inventoryRef, item.name); // ドキュメント ID にドリンク名を設定

    try {
      await setDoc(docRef, { quantity: item.quantity }); // フィールドとして quantity を登録
      console.log(`${item.name} の在庫を Firestore に登録しました`);
    } catch (error) {
      console.error(`エラー: ${item.name} の登録に失敗`, error);
    }
  }
}

function renderTable() {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";
  inventory.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.japaneseName}</td>
            <td>${item.requiredQuantity}</td>
            <td><input type="number"></td>
            <td><input id="inputQuantity" type="number" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)"></td>
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
  } catch (error) {
    console.error("更新エラー:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable();
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("updateInventory").addEventListener("click", () => {
    const hasEmptyField = inventory.some((item) => {
      if (item.quantity === null) {
        alert("入力されていない項目があります。");
        return true;
      }
      return false;
    });
    if (hasEmptyField) return;
    updateInventory();
    inventory.forEach((item) => {
      item.quantity = null;
    });
    renderTable();
  });
});

window.updateQuantity = updateQuantity;
window.initializeInventory = initializeInventory;
