export function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
    // everything except Firefox
      e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
  }
}

export function localStorageAvailable() {
  return storageAvailable('localStorage');
}

/**
 * Set a value from the store based off the key and the user
 *
 * @export
 * @param {Phaser.GameObjects.Sprite} user
 * @param {string} key
 * @param {*} value
 * @returns
 */
export function setUserItem(user, key, value) {
  if(!localStorageAvailable()) return;

  const scopedKey = `${user.user}-${key}`;
  localStorage.setItem(scopedKey, value);
}

/**
 * Get a value from the store based off the key and the user
 *
 * @export
 * @param {Phaser.GameObjects.Sprite} user
 * @param {string} key
 * @returns {string}
 */
export function getUserItem(user, key) {
  if(!localStorageAvailable()) return;

  const scopedKey = `${user.user}-${key}`;
  return localStorage.getItem(scopedKey);
}

export function getUserIntItem(user, key) {
  return parseInt(getUserItem(user, key));
}

export function clear() {
  return localStorage.clear();
}
