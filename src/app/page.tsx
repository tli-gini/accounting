import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1 className="title">- My Expense Tracker -</h1>
      <h2 className="welcome">Welcome to my Home!</h2>
      <div className="button-div">
        <Link className="button-to-accounting" href="/accounting">
          Click to Start!
        </Link>
      </div>
    </main>
  );
}
