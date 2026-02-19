// VOID-WALKER 3D Rendering Engine
const map = [[1,1,1,1,1], [1,0,0,0,1], [1,1,0,1,1], [1,0,0,0,1], [1,1,1,1,1]];
const FOV = Math.PI / 3;

function voidRender(pX, pY, pAngle) {
    let results = [];
    for (let i = 0; i < 60; i++) {
        let rAngle = (pAngle - FOV/2) + (i/60) * FOV;
        let dist = 0;
        let hit = false;
        while (!hit && dist < 15) {
            dist += 0.05;
            let tx = Math.floor(pX + Math.sin(rAngle) * dist);
            let ty = Math.floor(pY + Math.cos(rAngle) * dist);
            if (map[ty] && map[ty][tx] === 1) hit = true;
        }
        results.push(dist);
    }
    return results;
}
