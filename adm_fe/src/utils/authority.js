/**
 * authority: 0-管理员 1-媒体 2-广告主 3-底价管理员 4-审核管理员
 * */

export function getAuthority() {
  return localStorage.getItem('authority');
}

export function setAuthority(authority) {
  return localStorage.setItem('authority', authority);
}

export function removeAuthority() {
  return localStorage.removeItem('authority');
}