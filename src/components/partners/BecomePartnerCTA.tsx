import { Button } from "@/components/common/Button";
import { Tag } from "@/components/common/Tag";

const BENEFITS = [
  {
    title: "Host an evening",
    body: "Put your office and your people in front of the Belgian Fabric community.",
  },
  {
    title: "Reach practitioners",
    body: "Data engineers, analysts and architects who choose the tools they work with.",
  },
  {
    title: "Support the community",
    body: "Meetups stay free to attend because partners cover the room and the food.",
  },
];

interface BecomePartnerCTAProps {
  /** Drops the intro copy when the surrounding page already sets the scene */
  compact?: boolean;
}

export function BecomePartnerCTA({ compact = false }: BecomePartnerCTAProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <Tag>Partnerships</Tag>
        <h2 className="mt-4 text-3xl md:text-4xl">Become a Fabric Belgium partner</h2>
        {!compact && (
          <p className="mt-4 text-lg normal-case leading-relaxed tracking-normal text-text-secondary">
            Fabric Belgium runs on the companies that host our evenings and back the community. In
            return you get a room full of data professionals who are there because they want to be.
          </p>
        )}
        <div className="mt-8">
          <Button href="/contact" size="lg">
            Talk to us
          </Button>
        </div>
      </div>

      <ul className="space-y-4">
        {BENEFITS.map((benefit) => (
          <li key={benefit.title} className="border-t border-surface-border/60 pt-5">
            <h3 className="text-sm">{benefit.title}</h3>
            <p className="mt-2 text-sm normal-case leading-relaxed tracking-normal text-text-secondary">
              {benefit.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
