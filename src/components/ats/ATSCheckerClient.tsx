"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCVRecords } from "@/lib/cv-store";
import { CVRecord } from "@/lib/cv-types";
import { checkATS, MatchResult } from "@/lib/ats-engine";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import ScoreDial from "@/components/ui/ScoreDial";
import Select from "@/components/ui/Select";

export default function ATSCheckerClient() {
  const [cvs, setCvs] = useState<CVRecord[]>([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const records = await listCVRecords();
        setCvs(records);
        if (records.length > 0) {
          setSelectedCvId(records[0].id);
        }
      } catch (err) {
        console.error("Failed to load CVs:", err);
      }
    };
    fetchCVs().then(() => setIsLoaded(true));
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCvId || !jobDescription.trim()) return;

    setIsScanning(true);
    // Simulate a brief analysis delay for smooth UI feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    const selectedCv = cvs.find((c) => c.id === selectedCvId);
    if (selectedCv) {
      const matchResult = checkATS(selectedCv.data, jobDescription);
      setResult(matchResult);
    }
    setIsScanning(false);
  };

  const getScoreVerdict = (score: number) => {
    if (score >= 80) return { text: "Excellent Match!", desc: "Your CV is extremely well-optimized for this role. It contains almost all key industry skills and terms.", color: "text-success" };
    if (score >= 60) return { text: "Moderate Match", desc: "You have a solid foundation, but adding a few missing keywords from the job description would increase your chances.", color: "text-accent-text" };
    if (score >= 40) return { text: "Weak Match", desc: "Your resume is missing many core requirements listed in this job post. Tailor your experiences to match.", color: "text-warning" };
    return { text: "Poor Match", desc: "This resume does not fit the criteria. We recommend revising your skills and experience statements using terms from the job post.", color: "text-danger" };
  };

  if (!isLoaded) {
    return <div className="text-center py-12 text-muted label-micro animate-pulse">Loading engine...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Form Panel */}
      <Card>
        <form onSubmit={handleScan} className="flex flex-col gap-5">
          {cvs.length === 0 ? (
            <div className="p-4 border border-dashed border-border-strong rounded-xl bg-surface/50 text-center flex flex-col gap-3 items-center">
              <span className="text-xs text-muted-2 font-semibold">You need to create a resume first to run the ATS Checker.</span>
              <Link href="/builder/">
                <Button variant="primary" size="sm">Go to CV Builder</Button>
              </Link>
            </div>
          ) : (
            <Select
              label="Select Resume to Scan"
              id="ats-cv-select"
              value={selectedCvId}
              onChange={(e) => setSelectedCvId(e.target.value)}
              options={cvs.map((c) => ({ value: c.id, label: c.name }))}
            />
          )}

          <TextArea
            label="Target Job Description"
            id="ats-jd-input"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description or requirements section here..."
            rows={8}
            required
            disabled={cvs.length === 0}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isScanning || cvs.length === 0 || !jobDescription.trim()}
              className="w-full sm:w-auto"
            >
              {isScanning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-paper" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Keywords...
                </>
              ) : (
                "Scan Resume Match"
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Dashboard */}
      {result && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* Verdict Card */}
          <Card className="flex flex-col sm:flex-row items-center gap-6 py-6 px-6">
            <ScoreDial score={result.score} size={130} strokeWidth={11} className="shrink-0" />
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <h3 className={`font-serif text-2xl font-extrabold ${getScoreVerdict(result.score).color}`}>
                {getScoreVerdict(result.score).text}
              </h3>
              <p className="font-sans text-sm text-ink-2 leading-relaxed max-w-md">
                {getScoreVerdict(result.score).desc}
              </p>
            </div>
          </Card>

          {/* Detailed Lists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Formatting & Hygiene Alerts */}
            <Card className="flex flex-col gap-4">
              <h4 className="font-serif text-lg font-bold text-ink border-b border-border pb-2">
                Formatting &amp; Density Alerts
              </h4>
              <ul className="flex flex-col gap-3">
                {result.hygieneChecks.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-surface/30 border border-border-strong rounded-xl text-xs">
                    <span className="mt-0.5 shrink-0">
                      {check.severity === "success" && (
                        <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {check.severity === "warning" && (
                        <svg className="h-4 w-4 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      {check.severity === "danger" && (
                        <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-ink">{check.title}</span>
                      <span className="text-muted-2 leading-relaxed">{check.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Keyword Analysis Card */}
            <Card className="flex flex-col gap-4">
              <h4 className="font-serif text-lg font-bold text-ink border-b border-border pb-2">
                Keywords Breakdown
              </h4>
              
              <div className="flex flex-col gap-4">
                {/* Missing Keywords */}
                <div>
                  <span className="label-micro text-[10px] text-accent-text font-bold block mb-2">
                    Missing Keywords ({result.missingKeywords.length})
                  </span>
                  {result.missingKeywords.length === 0 ? (
                    <span className="text-xs text-muted-2 italic">None! You matched every keyword.</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                      {result.missingKeywords.map((k) => (
                        <span
                          key={k.keyword}
                          className="bg-danger/5 border border-danger/20 text-danger text-[11px] font-medium px-2 py-0.5 rounded-lg capitalize"
                          title={k.type === "soft_skill" ? "Soft skill (half weight)" : "Hard skill / term"}
                        >
                          {k.keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Matched Keywords */}
                <div>
                  <span className="label-micro text-[10px] text-success font-bold block mb-2">
                    Matched Keywords ({result.matchedKeywords.length})
                  </span>
                  {result.matchedKeywords.length === 0 ? (
                    <span className="text-xs text-muted-2 italic">No matching keywords found. Try adding key skills.</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                      {result.matchedKeywords.map((k) => (
                        <span
                          key={k.keyword}
                          className="bg-success/5 border border-success/20 text-success text-[11px] font-medium px-2 py-0.5 rounded-lg capitalize"
                        >
                          {k.keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

          </div>
        </div>
      )}
    </div>
  );
}
