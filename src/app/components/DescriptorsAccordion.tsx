import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export default function DescriptorsAccordion({
  descriptorsGrouped,
}: {
  descriptorsGrouped: Record<string, any[]>;
}) {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <Accordion type="multiple" defaultValue={Object.keys(descriptorsGrouped).length >= 2 ? ["1"] : ["0"]} className="w-full">
      {Object.entries(descriptorsGrouped).map(([category, group], index) => (
        <AccordionItem key={index} value={index.toString()}>
          <AccordionTrigger className="font-bold relative">
            <div className="flex flex-col items-start">
              <span>{category}</span>
              <span className="text-sm font-normal text-muted-foreground">Lütfen tıklayınız</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid lg:grid-cols-3 grid-cols-1 mx-6 mb-4 mt-2">
              {group.map((item, idx) => (
                <li className="flex flex-row mt-1 mb-1 list-none" key={idx}>
                  <p className="mr-2 font-light">{item.descriptor}</p>
                  <CheckCircle className="text-green-600" size={24} weight="fill" />
                </li>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
