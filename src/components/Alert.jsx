import { ToastContainer, toast } from 'react-toastify';

export default function Alert() {
  const notify = () => toast('Wow so easy !');

  return (
    <div className="grid place-items-center h-dvh bg-zinc-900/15">
      <Button onClick={notify}>Notify !</Button>
      <ToastContainer />
    </div>
  );
}