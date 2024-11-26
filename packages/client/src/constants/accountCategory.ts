import { CategoryInfo } from "@/types/account";

export const ACCOUNT_CATEGORY_INFO: CategoryInfo = {
  'balance': {
    text: '보유자산',
    path: '/account/balance'
  },
  'history': { 
    text: '거래내역',
    path: '/account/history'
  },
  'wait_orders': {
    text: '미체결',
    path: '/account/wait_orders'
  },
} ;