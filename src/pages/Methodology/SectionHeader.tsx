// Section Header Component
const SectionHeader = ({
  title,
  id,
  icon: Icon,
  description,
}: {
  title: string;
  id: string;
  icon?: React.ElementType;
  description?: string;
}) => (
  <div id={id} className="scroll-mt-6 mb-8 mt-16 first:mt-0">
    <div className="flex items-center gap-3 mb-2">
      {Icon && (
        <div className="p-2.5 rounded-lg bg-primary/10 shadow-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {description && <p className="text-muted-foreground mt-1">{description}</p>}
  </div>
);

export default SectionHeader;
