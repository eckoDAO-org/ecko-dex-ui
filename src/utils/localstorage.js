export const LocalStorageUtil = {
  // set a value in local storage
  set(key, value) {
    if (Array.isArray(value)) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  // get a value from local storage
  get(key) {
    const value = localStorage.getItem(key);

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return JSON.parse(value);
    }
  },

  // update a value in local storage
  update(key, updatedValues) {
    if (Array.isArray(updatedValues)) {
      // if the updated values are an array, replace the current value with the updated array
      this.set(key, updatedValues);
    } else {
      // if the updated values are an object, merge them into the current value
      const currentValue = this.get(key);

      if (currentValue === null) {
        return;
      }

      if (Array.isArray(currentValue)) {
        throw new Error('Cannot update array value with object values');
      } else {
        const updatedValue = { ...currentValue, ...updatedValues };

        this.set(key, updatedValue);
      }
    }
  },

  // delete a value from local storage
  remove(key) {
    localStorage.removeItem(key);
  },
};
