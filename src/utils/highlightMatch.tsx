const highlightMatch = (text: string, query: string) => {
  const q = query.trim();
  if (!q) return text;

  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();
  const idx = lowerText.indexOf(lowerQ);

  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);

  return (
    <>
      {before}
      <strong>{match}</strong>
      {after}
    </>
  );
};

export default highlightMatch;
