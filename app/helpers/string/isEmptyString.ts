const isEmptyString = (text?: string) => {
  if (text && text != '' && text.length > 0 && text != undefined) {
    return false;
  }
  return true;
};

export default isEmptyString;
