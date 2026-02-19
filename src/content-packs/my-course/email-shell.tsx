import type { PackEmailShellProps } from "@/content-packs/registry";
import {
  EmailContent,
  EmailFooter,
  EmailHeader,
  EmailLayout,
} from "@/emails/components/email-primitives";

// ✏️ Update the course name in <EmailHeader> to match your course.
//    This appears at the top of every email your subscribers receive.
//    You can also add a logo image here using a standard <img> tag.
export function StarterEmailShell(props: PackEmailShellProps) {
  return (
    <EmailLayout preview={props.preview}>
      <EmailHeader>How to Write an Email Course</EmailHeader>
      <EmailContent>{props.children}</EmailContent>
      <EmailFooter footer={props.footer} />
    </EmailLayout>
  );
}
