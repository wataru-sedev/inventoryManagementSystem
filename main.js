// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
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

// const KARUOSU = "かるおす";
// const MATTARI = "まったり";
// const MATCHA = "抹茶ビール";
// const ASAHI_SUPER_DRY = "アサヒスーパードライ";
// const YUZU_CHUHAI = "柚子チューハイ";
// const UME_CHUHAI = "梅チューハイ";
// const GYOKURO_UMESHU = "玉露梅酒";
// const HANNARI_UMESHU = "京はんなり梅酒";
// const JUNMAISHU = "京の地酒 純米酒";
// const YUZU_CIDER = "ゆずサイダー";
// const COLA = "コーラ";
// const ALL_FREE = "オールフリー";
// const JURAKUDAI = "聚楽第";
// const KINNSHIMASAMUNE = "金鵄正宗";
// const TAMAGAWA = "玉川";
// const GESSHOU = "げっしょう";
// const ORANGE = "オレンジジュース";

const drinks = [
  { name: "KARUOSU", quantity: 0 },
  { name: "MATTARI", quantity: 0 },
  { name: "MATCHA", quantity: 0 },
  { name: "ASAHI_SUPER_DRY", quantity: 0 },
  { name: "YUZU_CHUHAI", quantity: 0 },
  { name: "UME_CHUHAI", quantity: 0 },
  { name: "GYOKURO_UMESHU", quantity: 0 },
  { name: "HANNARI_UMESHU", quantity: 0 },
  { name: "JUNMAISHU", quantity: 0 },
  { name: "YUZU_CIDER", quantity: 0 },
  { name: "COLA", quantity: 0 },
  { name: "ALL_FREE", quantity: 0 },
  { name: "JURAKUDAI", quantity: 0 },
  { name: "KINNSHIMASAMUNE", quantity: 0 },
  { name: "TAMAGAWA", quantity: 0 },
  { name: "GESSHOU", quantity: 0 },
  { name: "ORANGE", quantity: 0 },
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

async function toggleEdit() {
  const editSection = document.getElementById("editSection");
  if (editSection.style.display === "none") {
    editSection.style.display = "block";
  } else {
    editSection.style.display = "none";
  }
}

async function resetInventory() {
  try {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    drinks.forEach(async (drink) => {
      await addDoc(collection(db, "inventory"), drink);
    });

    alert("在庫がリセットされました！");
    loadInventory();
  } catch (error) {
    console.error("リセットエラー: ", error);
  }
}

function renderTable() {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";
  inventory.forEach((item, index) => {
    table.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td><input type="number" value="${item.quantity}" onchange="updateQuantity(${index},this.value)"></td>
                        <td>
                            <button onclick="updateQuantity(${index}, document.querySelectorAll('input[type=number]')[${index}].value)">更新</button>
                            <button onclick="deleteDrink(${index})">削除</button>
                        </td>
                    </tr>
                `;
  });
}

async function addDrink() {
  const name = document.getElementById("drinkName").value.trim();
  const quantity = parseInt(document.getElementById("drinkQuantity").value, 10);
  if (!name) {
    alert("飲み物の名前を入力してください。");
    return;
  }
  if (isNaN(quantity) || quantity < 0) {
    alert("在庫数は0以上の数値を入力してください。");
    return;
  }

  try {
    await addDoc(collection(db, "inventory"), { name, quantity });
    alert("在庫データを追加しました！");
    loadInventory(); // Firestoreのデータを再読み込み
  } catch (error) {
    console.error("データ追加エラー: ", error);
  }
}

async function updateQuantity(index, quantity) {
  if (isNaN(quantity) || quantity < 0) {
    alert("在庫数は0以上の数値を入力してください。");
    return;
  }

  try {
    const docRef = doc(db, "inventory", inventory[index].id);
    await updateDoc(docRef, { quantity: parseInt(quantity, 10) });
    alert("在庫データを更新しました！");
    loadInventory();
  } catch (error) {
    console.error("更新エラー: ", error);
  }
}

async function deleteDrink(index) {
  try {
    const docRef = doc(db, "inventory", inventory[index].id);
    await deleteDoc(docRef);
    alert("在庫データを削除しました！");
    loadInventory(); // Firestoreのデータを再読み込み
  } catch (error) {
    console.error("削除エラー: ", error);
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

window.updateQuantity = updateQuantity;
window.deleteDrink = deleteDrink;
window.addDrink = addDrink;
window.toggleEdit = toggleEdit;
window.resetInventory = resetInventory;
window.initializeInventory = initializeInventory;
window.loadInventory = loadInventory;
