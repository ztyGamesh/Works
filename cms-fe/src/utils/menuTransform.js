// 深层克隆
const deepClone=(obj)=>{
   var proto=Object.getPrototypeOf(obj);
   return Object.assign([],Object.create(proto),obj);
}

export default (menuTree, allPages) => {
  // menuTree 自己维护的目录树
  // 后台请求 对应 role 的所有可见页面
  console.log(menuTree)
  var tempTree = deepClone(menuTree);
  tempTree.forEach((menu) => {
    allPages.forEach((page) => {
      if (page.address === menu.url) {
        menu.permission = page.permission;
        menu.children.forEach((child) => {
          allPages.forEach((page) => {
            if (page.address === child.url) {
              child.permission = page.permission;
            }
          })
        })
      }
    })
  })
  console.log(menuTree)
  return tempTree
};
