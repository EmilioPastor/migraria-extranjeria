import Checklist from "@/components/checklist/Checklist";
import checklists from "@/data/checklists/checklists.json";

export default function ArraigoSocialPage() {
  const data = checklists["reagrupacion-familiar"];

  return (
    <>
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <h1 className="text-4xl font-semibold text-[var(--primary)] mb-8">
            {data.title}
          </h1>

          <p className="text-readable max-w-3xl">
            {data.intro}
          </p>
        </div>
      </section>

      <Checklist
        title={data.title}
        intro={data.intro}
        items={data.items}
        tipoCita={data.tipoCita}
      />
    </>
  );
}
