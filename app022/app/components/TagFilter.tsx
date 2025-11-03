type TagSummary = {
  name: string;
  count: number;
};

type TagFilterProps = {
  tags: TagSummary[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export default function TagFilter({
  tags,
  selected,
  onChange,
}: TagFilterProps) {
  const handleToggle = (tagName: string) => {
    const isSelected = selected.includes(tagName);
    const updated = isSelected
      ? selected.filter((tag) => tag !== tagName)
      : [...selected, tagName];
    onChange(updated);
  };

  return (
    <fieldset className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <legend className="text-sm font-semibold text-zinc-800">
        Filter by tags
      </legend>
      {tags.length === 0 && (
        <p className="text-xs text-zinc-400">No tags collected yet.</p>
      )}
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <label
            key={tag.name}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-zinc-400"
          >
            <input
              type="checkbox"
              checked={selected.includes(tag.name)}
              onChange={() => handleToggle(tag.name)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
            />
            <span>
              {tag.name}{" "}
              <span className="text-[11px] text-zinc-400">({tag.count})</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
