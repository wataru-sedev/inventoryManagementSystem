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
    memo: null,
    quantity: null,
    requiredQuantity: 20,
  },
  {
    name: "MATTARI",
    japaneseName: "まったり(10)",
    memo: null,
    quantity: null,
    requiredQuantity: 20,
  },
  {
    name: "MATCHA",
    japaneseName: "抹茶ビール(5)",
    memo: null,
    quantity: null,
    requiredQuantity: 20,
  },
  {
    name: "JUNMAISHU",
    japaneseName: "京の地酒 純米酒(5)",
    memo: null,
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "ASAHI_SUPER_DRY",
    japaneseName: "アサヒスーパードライ(10)",
    memo: null,
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "YUZU_CHUHAI",
    japaneseName: "柚子チューハイ(5)",
    memo: null,
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "UME_CHUHAI",
    japaneseName: "梅チューハイ(5)",
    memo: null,
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "GYOKURO_UMESHU",
    japaneseName: "玉露梅酒(5)",
    memo: null,
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "HANNARI_UMESHU",
    japaneseName: "京はんなり梅酒(5)",
    memo: null,
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "YUZU_CIDER",
    japaneseName: "ゆずサイダー(10)",
    memo: null,
    quantity: null,
    requiredQuantity: 15,
  },
  {
    name: "COLA",
    japaneseName: "コーラ(10)",
    memo: null,
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "ALL_FREE",
    japaneseName: "オールフリー(8)",
    memo: null,
    quantity: null,
    requiredQuantity: 10,
  },
  {
    name: "JURAKUDAI",
    japaneseName: "聚楽第(1)",
    memo: null,
    quantity: null,
    requiredQuantity: 1,
  },
  {
    name: "KINSHIMASAMUNE",
    japaneseName: "金鵄政宗(1)",
    memo: null,
    quantity: null,
    requiredQuantity: 1,
  },
  {
    name: "TAMAGAWA",
    japaneseName: "玉川(1)",
    memo: null,
    quantity: null,
    requiredQuantity: 1,
  },
  {
    name: "GESSHOU",
    japaneseName: "げっしょう(1)",
    memo: null,
    quantity: null,
    requiredQuantity: 1,
  },
  {
    name: "ORANGE",
    japaneseName: "オレンジジュース(2/3)",
    memo: null,
    quantity: null,
    requiredQuantity: 2,
  },
];

let inventory = JSON.parse(localStorage.getItem("inventory")) || drinks;

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
            <td><input type="number" value="${item.memo}" onChange="updateMemo(${index}, this.value)" ></td>
            <td>${item.requiredQuantity}</td>
            <td><input id="inputQuantity" type="number" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)"></td>
        `;
    table.appendChild(row);
  });
  const div = `<div>
                <tr>
                    <td class="column1">炭酸(3)</td>
                    <td class="column3"><input type="number" id="tansan" /></td>                   
                </tr>
                <tr>
                    <td class="column1">嵐山コーラ(1)</td>
                    <td class="column3"><input type="number" id="arashiyama"/></td>                   
                </tr>
                <tr>
                    <td class="column1">しそジュース</td>
                    <td class="column3">Tへ返却<input type="checkbox" /></td>
                </tr>
            </div>`;
  table.insertAdjacentHTML("beforeend", div);
}

function updateQuantity(index, quantity) {
  if (isNaN(quantity) || quantity < 0) {
    alert("在庫数は0以上の数値を入力してください。");
    return;
  }
  inventory[index].quantity = parseInt(quantity, 10);
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

function updateMemo(index, memo) {
  inventory[index].memo = parseInt(memo, 10);
  localStorage.setItem("inventory", JSON.stringify(inventory));
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

async function loadInventory() {
  try {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    inventory = drinks.map((item) => {
      const docData = querySnapshot.docs.find((doc) => doc.id === item.name);
      return {
        id: item.name,
        name: item.name,
        requiredQuantity: item.requiredQuantity,
        japaneseName: item.japaneseName,
        quantity: docData ? docData.data().quantity : 0,
      };
    });
    renderTable();
  } catch (error) {
    console.error("読み込みエラー: ", error);
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
      item.memo = null;
      localStorage.clear();
    });
    renderTable();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadInventory").addEventListener("click", () => {
    loadInventory();
    alert("在庫データを読み込みました");
  });
});

window.updateQuantity = updateQuantity;
window.initializeInventory = initializeInventory;
window.updateMemo = updateMemo;
