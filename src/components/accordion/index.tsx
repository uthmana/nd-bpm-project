import { ReactNode, useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

interface AccordionProps {
  title?: string;
  index?: number;
  children?: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, index }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="mx-auto mb-3 w-full space-y-2">
      <div className="rounded-lg border  shadow-sm dark:border-gray-900">
        <button
          className="flex w-full items-center justify-between bg-gray-100 p-3 hover:bg-gray-200 dark:bg-[#111c44] dark:text-white"
          onClick={() => toggleAccordion(index)}
        >
          <span className="font-semibold">{title}</span>
          {openIndex === index ? (
            <MdKeyboardArrowUp size={20} />
          ) : (
            <MdKeyboardArrowDown size={20} />
          )}
        </button>
        {openIndex === index && (
          <div className="border-t bg-white p-3 dark:border-gray-900 dark:bg-[#111c44] dark:text-white ">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
