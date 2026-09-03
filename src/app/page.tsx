import Image from "next/image";

export default function Home() {
  return (
    <main className="section-padding container-site text-center">
      <Image
        src="/images/logo-mark.png"
        alt="Fabric Belgium"
        width={142}
        height={140}
        className="mx-auto mb-6"
        priority
      />
      <h1 className="text-3xl md:text-5xl">
        Empower every data professional with a community
      </h1>
      <p className="mt-4 normal-case tracking-normal text-text-secondary">
        Scaffold placeholder. See PROJECT-PLAN.md for the build plan this
        homepage will follow.
      </p>
    </main>
  );
}
