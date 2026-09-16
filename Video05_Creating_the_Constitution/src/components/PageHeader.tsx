export default function PageHeader({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="flex flex-col gap-3 py-8 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h1>
      <p className="max-w-prose text-base text-muted text-pretty sm:text-lg">{intro}</p>
    </div>
  );
}
