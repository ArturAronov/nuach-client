export default function Home() {
  return (
    <main>
      <div className="flex gap-5">
        <button>default button</button>
        <button className="button-primary">primary button</button>
        <button className="button-secondary">secondary button</button>
        <button className="button-neutral">neutral button</button>
        <button className="button-warning">warning button</button>
        <button className="button-error">error button</button>
      </div>

      <form>
        <label>label for text input</label>
        <input type="text" />
        <label>label for text area</label>
        <textarea />
      </form>
    </main>
  );
}
