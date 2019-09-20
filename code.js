var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function downloadImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        figma.showUI(__html__, { visible: false });
        figma.ui.postMessage(url);
        const newBytes = yield new Promise((resolve, reject) => {
            figma.ui.onmessage = value => resolve(value);
        });
        const newPaint = { scaleMode: 'FILL', type: 'IMAGE', imageHash: figma.createImage(newBytes).hash };
        return newPaint;
    });
}
function addAvatar(node) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://api.codetabs.com/v1/proxy?quest=https://thispersondoesnotexist.com/image?=' + Math.random();
        const avatar = figma.createEllipse();
        avatar.resize(128, 128);
        const paint = yield downloadImage(url);
        avatar.fills = [paint];
        if (node && (node.type === "GROUP" || node.type === "FRAME")) {
            node.appendChild(avatar);
        }
        return avatar;
    });
}
function createAvatars() {
    return __awaiter(this, void 0, void 0, function* () {
        if (figma.currentPage.selection.length) {
            yield Promise.all(figma.currentPage.selection.map(selected => addAvatar(selected)));
        }
        else {
            const avatar = yield addAvatar(null);
            figma.currentPage.appendChild(avatar);
            figma.currentPage.selection = [avatar];
            figma.viewport.scrollAndZoomIntoView([avatar]);
        }
    });
}
createAvatars()
    .catch(err => console.log('err', err))
    .then(() => figma.closePlugin());
