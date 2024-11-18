import { createTunnel } from 'tunnel-ssh';

export async function setupSshTunnel(): Promise<void> {
  const env = process.env.NODE_ENV || 'development';

  if (env !== 'development') {
    console.log('SSH 터널링은 개발 환경에서만 활성화됩니다.');
    return;
  }
  try {
    await Promise.all([tunnelMySQL(), tunnelRedis()]);
    console.log('MySQL 및 Redis 터널링 설정 완료');
  } catch (error) {
    console.error('SSH 터널링 설정 중 오류 발생:', error);
    throw error;
  }
}

function tunnelMySQL(): Promise<void> {
  return tunnel(
    {
      host: process.env.SSH_HOST,
      port: Number(process.env.SSH_PORT),
      username: process.env.SSH_USER,
      password: process.env.SSH_PASSWORD,
    },
    {
      srcAddr: process.env.DB_HOST,
      srcPort: Number(process.env.DB_PORT),
      dstAddr: process.env.SSH_DB_HOST,
      dstPort: Number(process.env.SSH_DB_TUNNEL_PORT),
    },
  );
}

function tunnelRedis(): Promise<void> {
  return tunnel(
    {
      host: process.env.SSH_HOST,
      port: Number(process.env.SSH_PORT),
      username: process.env.SSH_USER,
      password: process.env.SSH_PASSWORD,
    },
    {
      srcAddr: process.env.REDIS_HOST,
      srcPort: Number(process.env.REDIS_PORT),
      dstAddr: process.env.SSH_REDIS_HOST,
      dstPort: Number(process.env.SSH_REDIS_TUNNEL_PORT),
    },
  );
}

function tunnel(
  sshOptions: Record<string, any>,
  forwardOptions: {
    srcAddr: string;
    srcPort: number;
    dstAddr: string;
    dstPort: number;
  },
): Promise<void> {
  return new Promise((resolve, reject) => {
    createTunnel(
      { autoClose: true },
      { port: forwardOptions.srcPort },
      sshOptions,
      forwardOptions,
    )
      .then(() => {
        console.log(
          `터널링 성공: ${forwardOptions.dstAddr}:${forwardOptions.dstPort}`,
        );
        resolve();
      })
      .catch((error) => {
        console.error('터널 생성 중 오류 발생:', error);
        reject(error);
      });
  });
}
