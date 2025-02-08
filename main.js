const KARUOSU = "かるおす";
const MATTARI = "まったり";
const MATCHA = "抹茶ビール";
const YUZU_CHUHAI = "柚子チューハイ";
const UME_CHUHAI = "梅チューハイ";
const GYOKURO_UMESHU = "玉露梅酒";
const HANNARI_UMESHU = "京はんなり梅酒";
const JUNMAISHU = "京の地酒 純米酒";
const YUZU_CIDER = "ゆずサイダー";
const COLA = "コーラ";
const ALL_FREE = "オールフリー";
const JURAKUDAI = "聚楽第";
const KINNSHIMASAMUNE = "金鵄正宗";
const TAMAGAWA = "玉川";
const GESSHOU = "げっしょう";
const ORANGE = "オレンジジュース";

const drinks = [
  { name: KARUOSU, quantity: 0 },
  { name: MATTARI, quantity: 0 },
  { name: YUZU_CHUHAI, quantity: 0 },
  { name: UME_CHUHAI, quantity: 0 },
  { name: GYOKURO_UMESHU, quantity: 0 },
  { name: HANNARI_UMESHU, quantity: 0 },
  { name: JUNMAISHU, quantity: 0 },
  { name: YUZU_CIDER, quantity: 0 },
  { name: COLA, quantity: 0 },
  { name: ALL_FREE, quantity: 0 },
  { name: JURAKUDAI, quantity: 0 },
  { name: KINNSHIMASAMUNE, quantity: 0 },
  { name: TAMAGAWA, quantity: 0 },
  { name: GESSHOU, quantity: 0 },
  { name: ORANGE, quantity: 0 },
];

let inventory = JSON.parse(localStorage.getItem("inventory")) || drinks;

function toggleEdit() {
  const editSection = document.getElementById("editSection");
  if (editSection.style.display === "none") {
    editSection.style.display = "block";
  } else {
    editSection.style.display = "none";
  }
}

function resetInventory() {
  localStorage.setItem("inventory", JSON.stringify(drinks));
  inventory = drinks;
  renderTable();
}

function renderTable() {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";
  inventory.forEach((item, index) => {
    table.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td><input type="number" value="${item.quantity}" onchange="updateQuantitiy(${index},this.value)"></td>
                        <td>
                            <button onclick="updateQuantity(${index})">更新</button>
                            <button onclick="deleteDrink(${index})">削除</button>
                        </td>
                    </tr>
                `;
  });
}

function addDrink() {
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

  if (name && quantity) {
    inventory.push({ name, quantity });
    localStorage.setItem("inventory", JSON.stringify(inventory));
    renderTable();
  }
}

function updateQuantity(index) {
  const newQuantity = prompt("新しい在庫数を入力:", inventory[index].quantity);
  if (newQuantity !== null) {
    inventory[index].quantity = parseInt(newQuantity, 10);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    renderTable();
  }
}

function deleteDrink(index) {
  const drinkName = inventory[index].name;
  const isOriginalDrink = drinks.some((drink) => drink.name === drinkName);
  if (isOriginalDrink) {
    alert("この飲み物は削除できません。");
    return;
  }
  inventory.splice(index, 1);
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderTable();
}

renderTable();
