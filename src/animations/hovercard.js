// src/animations/hovercard.js

export function addHoverEffect(mesh, offset = 0.3, speed = 0.15) {
  if (!mesh) return;

  let targetZ = mesh.position.z;
  let animationFrame;

  function animate() {
    if (!mesh) return;
    mesh.position.z += (targetZ - mesh.position.z) * speed;
    if (Math.abs(targetZ - mesh.position.z) > 0.01) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
    }
  }

  return {
    hoverIn: () => {
      targetZ = mesh.position.z + offset;
      animate();
    },
    hoverOut: () => {
      targetZ = mesh.position.z - offset;
      animate();
    }
  };
}
