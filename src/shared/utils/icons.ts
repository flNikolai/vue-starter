/* eslint-disable ts/no-unsafe-return */
/// <reference types="vite/client" />

const svgResources = new Map()
const imageResources = new Map()

function loadIcons() {
  let modules = import.meta.glob('@/app/assets/icons/**/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  })
  for (const fileName in modules) {
    const name = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length - 4)
    svgResources.set(name, modules[fileName])
  }

  modules = import.meta.glob('@/app/assets/icons/**/*.png', {
    query: '?url',
    import: 'default',
    eager: true,
  })
  // debugger;
  for (const fileName in modules) {
    const name = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length - 4)
    imageResources.set(name, modules[fileName])
  }
  // console.log(imageResources);
  // console.log(getIcon("lobby"));
}

function getSvgIcon(name: string) {
  return svgResources.get(name)
}

function getImageUrl(name: string) {
  return imageResources.get(name)
}

// export svgResources;

// export default iconMap;
// export { iconMap, getIcon, svgResources };
export { getImageUrl, getSvgIcon, loadIcons, svgResources }
