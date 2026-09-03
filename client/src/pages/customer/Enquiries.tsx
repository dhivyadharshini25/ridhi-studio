import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getEnquiries,
  getMyFiles,
  downloadFile,
} from '../../services/resources';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<any[] | null>(null);
  const [files, setFiles] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const enquiryRes = await getEnquiries();
        const enquiryList = enquiryRes.data.enquiries || [];

        setEnquiries(enquiryList);

        const fileResults = await Promise.all(
          enquiryList.map(async (enquiry: any) => {
            try {
              const fileRes = await getMyFiles(
                `?enquiryId=${enquiry.id}`
              );

              return {
                enquiryId: enquiry.id,
                files: fileRes.data.files || [],
              };
            } catch {
              return {
                enquiryId: enquiry.id,
                files: [],
              };
            }
          })
        );

        const fileMap: Record<string, any[]> = {};

        fileResults.forEach((item) => {
          fileMap[item.enquiryId] = item.files;
        });

        setFiles(fileMap);
      } catch {
        setEnquiries([]);
      }
    }

    loadData();
  }, []);

  if (!enquiries) return <LoadingState />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          My Enquiries
        </h1>

        <Link
          to="/start-a-project"
          className="btn-primary !py-2 text-sm"
        >
          New Enquiry
        </Link>
      </div>

      {enquiries.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          subtitle="Start a project to see it here."
        />
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => {
            const enquiryFiles = files[e.id] || [];

            return (
              <div key={e.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {e.service_title || 'General Enquiry'}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {e.details}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Submitted{' '}
                      {new Date(e.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <StatusBadge status={e.status} />
                </div>

                {/* Uploaded Reference Files */}
                {enquiryFiles.length > 0 && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      📎 Reference Files
                    </p>

                    <div className="space-y-2">
                      {enquiryFiles.map((file) => (
                        <button
                          key={file.id}
                          type="button"
                          onClick={() => downloadFile(file.id, file.file_name)}
                          className="block w-full rounded-lg bg-white p-3 text-left text-sm font-medium text-lavender-700 hover:bg-lavender-50"
                        >
                          📄 {file.file_name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {e.admin_notes && (
                  <p className="mt-3 rounded-xl bg-lavender-50 p-3 text-sm text-lavender-700">
                    Note from studio: {e.admin_notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}