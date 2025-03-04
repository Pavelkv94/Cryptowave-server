export const buildPriorDate = () => {
  const nowDate = new Date();
  const priorDate = new Date(nowDate.getTime() - 28 * 24 * 60 * 60 * 1000);

  const year = priorDate.getFullYear();
  const month = String(priorDate.getMonth() + 1).padStart(2, "0");
  const day = String(priorDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
