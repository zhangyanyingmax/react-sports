/*
  本地存储方法
 */

const USE_KEY = 'user';

function getItem() {
  return JSON.parse(localStorage.getItem(USE_KEY))
};

function setItem(user) {
  localStorage.setItem(USE_KEY,JSON.stringify(user))
};


function removeItem() {
  localStorage.removeItem(USE_KEY)
};


//暴露
export {
  getItem,
  setItem,
  removeItem
}