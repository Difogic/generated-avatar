async function downloadImage(url) {
  figma.showUI(__html__, { visible: false })

  figma.ui.postMessage(url)

  const newBytes: Uint8Array = await new Promise((resolve, reject) => {
    figma.ui.onmessage = value => resolve(value as Uint8Array)
  })

  const newPaint: Paint = { scaleMode: 'FILL', type: 'IMAGE', imageHash: figma.createImage(newBytes).hash };
  return newPaint
}

async function addAvatar(node) {
  const url = 'https://api.codetabs.com/v1/proxy?quest=https://thispersondoesnotexist.com/image?=' + Math.random()
  const avatar = figma.createEllipse()
  avatar.resize(128, 128)

  const paint: Paint = await downloadImage(url)
  avatar.fills = [ paint ]

  if (node && (node.type === "GROUP" || node.type === "FRAME")) {
    node.appendChild(avatar)
  }
  
  return avatar
}

async function createAvatars () {
  if (figma.currentPage.selection.length) {
    await Promise.all(figma.currentPage.selection.map(selected => addAvatar(selected)))
  } else {
    const avatar = await addAvatar(null)
    figma.currentPage.appendChild(avatar);
    figma.currentPage.selection = [avatar];
    figma.viewport.scrollAndZoomIntoView([avatar]);  
  } 
}

createAvatars()
  .catch(err => console.log('err', err))
  .then(() => figma.closePlugin())