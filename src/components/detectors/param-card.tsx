'use client';

import type { AnalyzedParam } from '@/lib/analyzers';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { BADGE_LABEL } from '@/lib/param-labels';
import { ParamDetail } from './param-detail';

export function ParamCard({ param }: { param: AnalyzedParam }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-xs text-muted-foreground">{param.key || '—'}</code>
          <Badge variant={param.kind}>{BADGE_LABEL[param.kind]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ParamDetail param={param} />
      </CardContent>
    </Card>
  );
}
