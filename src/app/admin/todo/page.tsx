export default function Todo() {
  return (
    <main className=" bg-slate-50 flex min-h-screen items-center justify-center ">
      <div className="bg-slate-300 text-slate-800 flex  h-[400px] w-[450px] flex-col rounded-3xl py-6">
        <h1 className="text-center text-3xl">My to dos</h1>
        <div className="mx-8 mb-6 mt-4">
          <form className="flex items-center gap-3">
            <input
              type="text"
              name="title"
              placeholder="New todo"
              className=" border-slate-400 focus-within:border-slate-100 bg-slate-50 focus-within:bg-slate-100  placeholder:text-slate-300 flex-1 rounded-full border px-2 py-1 outline-none"
              required
            />
            <button className="  bg-slate-50 border-slate-400 text-slate-400 hover:text-slate-500 hover:ring-slate-100 hover:border-slate-500 rounded-full border p-1 text-base hover:ring-0">
              <p className=" text-center">+</p>
            </button>
          </form>
        </div>
        <ul className="px-6">
          <li className="flex px-4">
            <span className="flex flex-1 gap-2">
              <input
                type="checkbox"
                name="check"
                className="accent-slate-300 peer cursor-pointer "
              />
              <label
                htmlFor=""
                className="peer-checked:text-slate-500 cursor-pointer peer-checked:line-through"
              >
                Todo 1
              </label>
            </span>
            <button className="text-slate-500  hover:text-slate-800 mr-3">
              X
            </button>
          </li>
        </ul>
      </div>
    </main>
  );
}
