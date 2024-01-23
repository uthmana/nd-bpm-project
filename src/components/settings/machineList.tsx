'use client';

const MachineList = ({
  machines,
  handleDeleteMachine,
  handleDeleteTechParams,
}) => {
  const onDeleteMachine = async (id: string) => {
    handleDeleteMachine(id);
  };

  const onDeleteTechParams = async (id: string) => {
    handleDeleteTechParams(id);
  };
  if (machines?.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-2">
      {machines.map((item, idx) => {
        return (
          <div
            key={idx}
            className="relative flex flex-col items-start justify-start rounded-2xl border bg-white bg-clip-border px-3 py-4 shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
          >
            <button
              onClick={() => onDeleteMachine(item.id)}
              className="absolute right-2 top-0 text-lg hover:text-red-500"
            >
              X
            </button>
            <p className="mb-2 text-lg font-bold  text-navy-700 dark:text-white">
              {item.machine_Name}
            </p>
            <div className="mb-2 h-[1px] w-full bg-gray-400" />
            <div className="w-full">
              <div className="mb-2 text-sm text-gray-800">
                Teknikal Parametreleri
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {item?.machineParams?.length > 0 ? (
                  <>
                    {item.machineParams.map((item, idx) => {
                      return (
                        <span
                          key={idx}
                          className="rounded-md bg-gray-600 px-2 py-1 text-sm font-bold text-white"
                        >
                          {item.param_name}{' '}
                          <button
                            onClick={() => onDeleteTechParams(item.id)}
                            className="text-red-500"
                          >
                            X
                          </button>
                        </span>
                      );
                    })}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MachineList;
