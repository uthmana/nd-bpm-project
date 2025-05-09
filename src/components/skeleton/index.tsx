// Loading animation

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

//TODO: Add dark mode style
export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="rounded-xl bg-gray-100 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-100">
        <div className="bg-white px-6 dark:bg-navy-900">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <div className="flex items-center pb-2 pt-6">
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function InvoicesMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function UserFormSkeleton() {
  return (
    <div className="w-full">
      <InvoicesMobileSkeleton />
      <InvoicesMobileSkeleton />
      <InvoicesMobileSkeleton />
    </div>
  );
}

// New Skeleton
export function TableSkeleton() {
  return (
    <div className={`relative flex w-full flex-col overflow-hidden`}>
      <div className="flex w-full grow flex-col justify-between rounded-xl">
        <HeaderSkeleton />
        <div className="flex w-full flex-col divide-y rounded-lg bg-white px-6 py-5 dark:bg-navy-800">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => {
            if (item === 1) {
              return <NewTableRowSkeleton key={idx} header={true} />;
            }
            return <NewTableRowSkeleton key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="relative mb-7 flex animate-pulse items-center justify-between gap-4 border-b bg-gray-100/0 py-3 dark:bg-navy-800/0">
      <div className="h-[38px] w-[200px]  rounded-lg bg-gray-200"></div>
      <div className="h-[34px] w-[100px]  rounded-lg bg-gray-200"></div>
    </header>
  );
}

export function NewTableRowSkeleton(props: { header?: boolean }) {
  const { header } = props;
  if (header) {
    return (
      <div className="grid w-full grid-cols-5 py-5">
        {[1, 2, 3, 4, 5].map((item, idx) => {
          return (
            <div
              key={idx}
              className="h-2 w-10 animate-pulse rounded-lg bg-gray-200 md:h-3 md:w-20"
            ></div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="grid w-full grid-cols-5 py-4">
      {[1, 2, 3, 4, 5].map((item, idx) => {
        return (
          <div key={idx} className="flex animate-pulse flex-col gap-1">
            <div className="h-1 w-10 rounded-lg bg-gray-100 md:h-2 md:w-20" />
            <div className="h-1 w-6 rounded-lg bg-gray-100 md:h-2 md:w-16" />
          </div>
        );
      })}
    </div>
  );
}

export function NewDashboardSkeleton({ nav = true }) {
  return (
    <div className="w-full animate-pulse bg-[#f4f7fe] px-2 dark:bg-navy-800">
      {nav ? (
        <>
          <NavbarSkeleton /> <BreadCrambSkeleton />
        </>
      ) : null}

      <div className="mb-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item, idx) => {
          return <NewCardSkeleton key={idx} />;
        })}
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <LargeBoxSkeleton />
        <LargeBoxSkeleton />
      </div>
      <div className="flex w-full animate-pulse flex-col divide-y rounded-lg bg-white px-6 py-5 dark:bg-navy-800">
        {[1, 2, 3, 4, 5].map((item, idx) => {
          if (item === 1) {
            return <NewTableRowSkeleton key={idx} header={true} />;
          }
          return <NewTableRowSkeleton key={idx} />;
        })}
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <div className="mb-8 flex items-center justify-between py-6">
      <div className="ml-2 h-6 w-7 rounded-sm  bg-gray-200" />
      <div className="ml-2 h-10 w-36 rounded-full bg-gray-200" />
    </div>
  );
}

export function BreadCrambSkeleton() {
  return (
    <div className="mb-12 flex flex-col gap-1">
      <div className="ml-2 h-2 w-36 rounded-full bg-gray-200" />
      <div className="ml-2 h-2 w-24 rounded-sm bg-gray-200" />
    </div>
  );
}

export function NewCardSkeleton() {
  return (
    <div className="flex  items-center gap-2 rounded-xl bg-white p-6 dark:bg-navy-600">
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="h-2 w-20 rounded-md bg-gray-200" />
        <div className="h-2 w-16 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function LargeBoxSkeleton() {
  return (
    <div className="flex min-h-[300px] flex-col gap-2 rounded-lg bg-white p-8 dark:bg-navy-600">
      <div className="h-2 w-20 rounded-md bg-gray-200" />
      <div className="h-2 w-16 rounded-md bg-gray-200" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <>
      <div className="mb-5 w-full animate-pulse rounded-md">
        <div className="mb-4 flex items-center justify-between gap-2 rounded-md bg-white p-7 dark:bg-navy-600">
          <div className="h-4 w-20 rounded-md bg-gray-200" />
          <div className="h-2 w-16 rounded-md bg-gray-200" />
        </div>

        <div className="bg-white  p-7  dark:bg-navy-600">
          <div className="mb-10 flex w-full  flex-col gap-2 ">
            <div className="flex w-full items-center justify-between">
              <div className="h-4 w-24 rounded-md bg-gray-200" />
              <div className="h-7 w-32 rounded-md bg-gray-200" />
            </div>
          </div>
          <div className="mb-4 grid w-full grid-cols-3 items-center gap-12 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => {
              return (
                <div key={idx} className="flex w-full flex-col gap-2">
                  <div className="h-2 w-32 rounded-md bg-gray-200" />
                  <div className="h-2 w-16 rounded-md bg-gray-200" />
                  <div className="h-2 w-12 rounded-md bg-gray-200" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-white  p-7  dark:bg-navy-600">
        <div className="mb-10 flex w-full  flex-col gap-2 ">
          <div className="flex w-full items-center justify-between">
            <div className="h-4 w-24 rounded-md bg-gray-200" />
            <div className="h-7 w-32 rounded-md bg-gray-200" />
          </div>
        </div>
        <div className="mb-4 grid w-full grid-cols-3 items-center gap-12 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => {
            return (
              <div key={idx} className="flex w-full flex-col gap-2">
                <div className="h-2 w-32 rounded-md bg-gray-200" />
                <div className="h-2 w-16 rounded-md bg-gray-200" />
                <div className="h-2 w-12 rounded-md bg-gray-200" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function FormSkeleton() {
  return (
    <div className="mb-10  w-full animate-pulse rounded-md  bg-white p-7 dark:bg-navy-600">
      <div className="mb-4 flex flex-col items-center justify-center gap-2 rounded-md bg-white p-7 dark:bg-navy-600">
        <div className="h-2 w-64 rounded-md bg-gray-200" />
        <div className="h-2 w-32 rounded-md bg-gray-200" />
      </div>

      <div className="mb-7 bg-white dark:bg-navy-600">
        <div className="mb-4 grid w-full grid-cols-1 gap-12 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item, idx) => {
            return (
              <div key={idx} className="flex flex-col gap-2">
                <div className="h-2 w-32 rounded-md bg-gray-200" />
                <div className="h-8 w-full rounded-md bg-gray-200" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <div className="h-2 w-32 rounded-md bg-gray-200" />
        <div className="h-20 w-full rounded-md bg-gray-200" />
      </div>

      <div className="h-10 w-full rounded-md bg-gray-200" />
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="mb-10 w-full animate-pulse rounded-md bg-white  p-7 pt-10 dark:bg-navy-600">
      <div
        className="mb-16 flex  items-center justify-between
       gap-2 rounded-md bg-white dark:bg-navy-600"
      >
        <div className="h-8 w-64 rounded-md bg-gray-200" />
        <div className="h-8 w-32 rounded-md bg-gray-200" />
      </div>
      <div className="mb-7 bg-white dark:bg-navy-600">
        <div
          className="mb-4 grid w-full grid-cols-2 gap-12 sm:grid-cols-3
        md:grid-cols-4"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => {
            return (
              <div key={idx} className="h-32 w-full rounded-md bg-gray-200" />
            );
          })}
        </div>
      </div>
    </div>
  );
}
