interface Feed {
  elements: string[];
}

export default function Feed({ elements }: Feed) {
  return (
    <div>
      {elements.map((value, index) => (
        <div>{value}</div>
      ))}
    </div>
  );
}
