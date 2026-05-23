import CreateLinkForm from '@/components/CreateLinkForm';
import LinkHistory from '@/components/LinkHistory';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 selection:bg-purple-500/30">
      <LinkHistory />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-neutral-950 to-neutral-950 -z-10" />
      
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            LinkShort
          </span>
        </h1>
        <p className="text-xl text-gray-400">
          A high-performance, serverless URL shortener built for speed.
        </p>
      </div>

      <CreateLinkForm />
    </main>
  );
}
