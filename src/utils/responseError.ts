type _resErr = {
  error: string;
  details: string;
};

type _err = {
  detail: string;
  message: string;
};

type resObj = {
  data: Array<any>;
  error: _err;
  response: _resErr;
  status: number;
};

export function getResError(res: string) {
  if (!res) return 'Error not found';

  let data: resObj;

  try {
    data = JSON.parse(res);
  } catch (e) {
    console.error('Error details:', e);
    return e.message;
  }

  const { error, response } = data || {};
  const { error: resErr, details } = response || {};
  const { message, detail } = error || {};

  const msg = message || details || resErr || 'Unknown error occurred';

  console.error('Error details:', details, detail);
  console.log('Parsed response:', data);

  return msg;
}
