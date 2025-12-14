import { requireAdmin } from '@/lib/utils/auth'
import { getLogs } from '@/app/actions/logs'
import { LogsTable } from '@/components/LogsTable'

export default async function LogsPage() {
  await requireAdmin()
  const { logs } = await getLogs(100)

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold mb-8">Logs système</h1>
      <LogsTable logs={logs} showDownload />
    </div>
  )
}

