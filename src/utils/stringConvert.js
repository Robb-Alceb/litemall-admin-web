
// 下划线转换驼峰
export function toHump(str) {
  return str.replace(/\_(\w)/g, function(all, letter){
    return letter.toUpperCase();
  });
}

// 驼峰转换下划线
export function toLine(str) {
  return str.replace(/([A-Z])/g,"_$1").toLowerCase();
}
